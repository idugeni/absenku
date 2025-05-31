import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const validateQr = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { eventId, token, nip } = req.body;

  if (!eventId || !token || !nip) {
    res.status(400).send("Missing parameters");
    return;
  }

  try {
    const eventRef = admin.firestore().collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      res.status(404).send("Event not found");
      return;
    }

    const eventData = eventDoc.data();

    if (eventData?.qrCodeToken !== token) {
      res.status(401).send("Invalid QR code token");
      return;
    }

    // Validate NIP against Firestore 'pegawai' collection
    const pegawaiRef = admin.firestore().collection("pegawai");
    const pegawaiSnapshot = await pegawaiRef.where("nip", "==", nip).limit(1).get();

    if (pegawaiSnapshot.empty) {
      res.status(401).send("Invalid NIP");
      return;
    }

    // Record attendance (example: add NIP to a subcollection or update event)
    await eventRef.collection("attendances").add({
      nip: nip,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("Attendance recorded successfully");
  } catch (error) {
    console.error("Error validating QR code:", error);
    res.status(500).send("Internal Server Error");
  }
});