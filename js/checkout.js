// ✅ Firebase Import

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"; // Add Storage import

import { firebaseConfig } from "./firebase.js"; // ✅ Importing only config

// ✅ Firebase Configuration and Initialize

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app); // Initialize Storage

// ✅ Start Loader (Common for Login & Checkout Data)

function startLoader() {

if (!document.getElementById("loadingSpinner")) {

const loader = document.createElement("div");

loader.id = "loadingSpinner";

loader.style.position = "fixed";

loader.style.top = "0";

loader.style.left = "0";

loader.style.width = "100vw";

loader.style.height = "100vh";

loader.style.background = "rgba(0, 0, 0, 0.7)";

loader.style.display = "flex";

loader.style.alignItems = "center";

loader.style.justifyContent = "center";

loader.style.zIndex = "9999";

loader.innerHTML = `

  <div style="width: 60px; height: 60px; border: 5px solid white; border-top-color: #FF0000; border-radius: 50%; animation: spin 1s linear infinite;"></div>  <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>`;

document.body.appendChild(loader);

}

}

// ✅ Stop Loader

function stopLoader() {

const loader = document.getElementById("loadingSpinner");

if (loader) {

loader.remove();

}

}

// ✅ Check Authentication + Load Checkout Data with Loader

startLoader(); // ✅ Loader Start before everything

onAuthStateChanged(auth, (user) => {

if (!user) {

alert("⚠ Please login to continue checkout.");

sessionStorage.setItem("redirectAfterLogin", window.location.href);

window.location.href = "login.html";

} else {

document.getElementById("userEmail").textContent = user.email;

document.getElementById("userEmail").style.display = "inline-block";

loadCheckoutData();

}

});

// ✅ Load Order Details from sessionStorage (Fixed Properly)
function loadCheckoutData() {
  setTimeout(() => {
    const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));
    if (!orderDetails) {
      alert("⚠ No order details found! Redirecting to home.");
      window.location.href = "index.html";
      return;
    }
    
    // Fill basic order details
    document.getElementById("orderName").textContent = orderDetails.name || "";
    document.getElementById("orderPrice").textContent = orderDetails.price || "";
    document.getElementById("orderType").textContent = `Product Type: ${orderDetails.type || ""}`;
    document.getElementById("fullName").textContent = orderDetails.fullName || "";
    document.getElementById("address").textContent = orderDetails.address || "";
    document.getElementById("city").textContent = orderDetails.city || "";
    document.getElementById("state").textContent = orderDetails.state || "";
    document.getElementById("pincode").textContent = orderDetails.pincode || "";
    document.getElementById("mobile").textContent = orderDetails.mobile || "";
    
    // Clear previous preview
    document.getElementById("orderImage1").style.display = "none";
    document.getElementById("orderImage2").style.display = "none";
    const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
    if (pdfPreviewContainer) {
      pdfPreviewContainer.innerHTML = "";
      pdfPreviewContainer.style.display = "none";
    }
    const pdfPasswordDisplay = document.getElementById("pdfPasswordDisplay");
    if (pdfPasswordDisplay) {
      pdfPasswordDisplay.textContent = "";
      pdfPasswordDisplay.style.display = "none";
    }
    
    // Check for PDF or Images
if (orderDetails.pdfBase64) {
  if (pdfPreviewContainer) {
    // PDF Preview container style
    pdfPreviewContainer.style.display = "flex";
    pdfPreviewContainer.style.flexDirection = "column";
    pdfPreviewContainer.style.justifyContent = "center";
    pdfPreviewContainer.style.alignItems = "center";
    pdfPreviewContainer.style.marginTop = "20px";
    pdfPreviewContainer.style.gap = "15px";
    pdfPreviewContainer.style.border = "1px solid #f5c6cb";
    pdfPreviewContainer.style.padding = "20px";
    pdfPreviewContainer.style.borderRadius = "8px";
    pdfPreviewContainer.style.backgroundColor = "#fff"; // white background
    pdfPreviewContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"; // light shadow
    
    // Embed PDF
    pdfPreviewContainer.innerHTML = `
      <embed src="${orderDetails.pdfBase64}" type="application/pdf" width="220px" height="152px" style="
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      " />
    `;
    
    // Create Password container separately
    if (orderDetails.pdfPassword && orderDetails.pdfPassword.trim() !== "") {
      const passwordDiv = document.createElement("div");
      passwordDiv.style.marginTop = "20px";
      passwordDiv.style.padding = "10px 20px";
      passwordDiv.style.backgroundColor = "#f8f9fa"; // soft light gray
      passwordDiv.style.color = "black"; // dark red text
      passwordDiv.style.border = "1px solid #dee2e6";
      passwordDiv.style.borderRadius = "6px";
      passwordDiv.style.fontWeight = "600";
      passwordDiv.style.fontSize = "1.1rem";
      passwordDiv.style.textAlign = "center";
      passwordDiv.style.maxWidth = "300px";
      passwordDiv.style.wordBreak = "break-word";
      passwordDiv.style.fontFamily = "'Segoe UI', sans-serif";
      passwordDiv.textContent = `Password: ${orderDetails.pdfPassword}`;
      
      // Add passwordDiv separately after embed
      pdfPreviewContainer.appendChild(passwordDiv);
    }
  }
}
// …पहले का कोड (PDF क्रिया वाली शाख़)

else if (orderDetails.image1 || orderDetails.image2) {
  // कम से कम एक इमेज मिली है
  const img1 = document.getElementById("orderImage1");
  const img2 = document.getElementById("orderImage2");

  // अगर image1 है तो उसे दिखाओ, नहीं तो छुपाओ
  if (orderDetails.image1) {
    img1.src = orderDetails.image1;
    img1.style.display = "block";
  } else {
    img1.style.display = "none";
  }

  // अगर image2 है तो उसे दिखाओ, नहीं तो छुपाओ
  if (orderDetails.image2) {
    img2.src = orderDetails.image2;
    img2.style.display = "block";
  } else {
    img2.style.display = "none";
  }
}
    
    stopLoader();
  }, 1000);
}
// ✅ Payment Integration with Razorpay

document.getElementById("placeOrderBtn").addEventListener("click", async function() {
try {
const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));
const user = auth.currentUser;
if (!user) {
  alert("Please login first!");
  return window.location.href = "login.html";
}

// Basic Validation
if (!orderDetails?.price || !orderDetails?.name) {
  throw new Error("Invalid order details");
}
showLoader();


// Convert Price to Paise
const amount = parseInt(orderDetails.price.replace(/[^0-9]/g, "")) * 100;
const options = {
  key: "rzp_live_VfZEc1nrbqDHVP",
  amount: amount,
  currency: "INR",
  name: "Easy PVC",
  description: orderDetails.name,
  image: "./img/logo.png",
  prefill: {
    name: orderDetails.fullName,
    email: user.email,
    contact: orderDetails.mobile
  },
  theme: { color: "#FFB3B3" },
  handler: async function(response) {

    try {
      if (!response.razorpay_payment_id) {
        throw new Error("Payment failed");
      }

      // Upload Images to Firebase Storage
      const uploadFile = async (fileData, fileName, onProgress) => {
  if (!fileData.startsWith("data:")) return fileData; // Already URL, return it
  
  const blob = await fetch(fileData).then(r => r.blob());
  const storageRef = ref(storage, `orders/${auth.currentUser.uid}/${Date.now()}_${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, blob);
  
  return new Promise((resolve, reject) => {
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress.toFixed(0));
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

// Upload both images
      let uploads = [];

if (orderDetails.pdfBase64) {
  uploads.push(
    uploadFile(orderDetails.pdfBase64, "document", (progress) => {
      updateProgress(1, progress);
    })
  );
} else {
  uploads.push(
    uploadFile(orderDetails.image1, "design1", (progress) => {
      updateProgress(1, progress);
    }),
    uploadFile(orderDetails.image2 || "", "design2", (progress) => {
      updateProgress(2, progress);
    })
  );
}

const uploadedUrls = await Promise.all(uploads);

// Then, while saving in Firebase:
let orderToSave = {
  ...orderDetails,
  email: user.email,
  uid: user.uid,
  paymentId: response.razorpay_payment_id,
  paymentStatus: "Paid",
  timestamp: new Date().toISOString()
};

// PDF hai to URL daalo aur base64 hata do
if (orderDetails.pdfBase64) {
  orderToSave.pdfUrl = uploadedUrls[0];
  delete orderToSave.pdfBase64; // Important to avoid saving large data
} else {
  // Images daalo
  orderToSave.image1 = uploadedUrls[0];
  orderToSave.image2 = uploadedUrls[1] || "No second image";
}

// ✅ Save Order to Firebase and Get Order ID
const firestoreOrderId = await saveOrderToFirebase(orderToSave);

// ✅ Save Order Details in sessionStorage for order-success.html
sessionStorage.setItem("paymentDetails", JSON.stringify({
  orderDetails: {
    name: orderDetails.name,
    price: orderDetails.price
  },
  paymentId: response.razorpay_payment_id,
  paymentStatus: "Paid",
  orderId: firestoreOrderId // ✅ Added Order ID Here
}));


window.location.href = "order-success.html";
    } catch (error) {
      alert(`Payment Failed: ${error.message}`);
    } finally {
      hideLoader();
    }
  },
  modal: {
    ondismiss: () => {
      alert("⚠️Payment cancelled. You can retry payment.");
      hideLoader();
    }
  }
};

const rzp = new Razorpay(options);
rzp.open();

} catch (error) {

alert(`Error: ${error.message}`);
hideLoader();

}

});

function updateProgress(imageNo, percent) {

const progressBar = document.getElementById("uploadProgressBar");

const progressText = document.getElementById("uploadProgressText");

if (progressBar && progressText) {

progressText.textContent = `Uploading file ${imageNo}: ${percent}%`;

progressBar.style.width = `${percent}%`;

}

}

// ✅ Show Funny Loader Function (Red-White Theme)

function showLoader() {
  if (!document.getElementById("customLoader")) {
    const loader = document.createElement("div");
    loader.id = "customLoader";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100vw";
    loader.style.height = "100vh";
    loader.style.background = "#FFFFFF";
    loader.style.backdropFilter = "blur(6px)";
    loader.style.display = "flex";
    loader.style.flexDirection = "column";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.zIndex = "9999";
    
    loader.innerHTML = `
      <div class="loader-animation"></div>
      <div style="margin-top: 30px; width: 80%; max-width: 400px; text-align: center;">
        <div style="position: relative; background: #eee; border-radius: 10px; overflow: hidden; height: 20px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
          <div id="uploadProgressBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff4b4b, #d80000); border-radius: 10px; transition: width 0.3s ease;"></div>
          <div id="uploadProgressText" style="position: absolute; width: 100%; top: 0; left: 0; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; background: rgba(0,0,0,0.2);  /* Add this line */ color: white; font-family: 'Segoe UI', sans-serif;">Uploading image 1: 0%</div>
        </div>
        <div style="margin-top: 15px; font-size: 1.5rem; color: #000000;">Please wait while we upload your files...</div>
      </div>
<style>
#uploadProgressBar {
  background: linear-gradient(270deg, #ff4b4b, #d80000);
  background-size: 200% 200%;
  animation: progressAnim 1.5s ease infinite;
}

@keyframes progressAnim {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
} </style>
      <style>
        .loader-animation {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(216, 0, 0, 0.2);
          border-top: 6px solid #d80000;
          border-radius: 50%;
          animation: spin 1.2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(216, 0, 0, 0.4);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loader);
  }
}
// ✅ Hide Loader Function

function hideLoader() {

const loader = document.getElementById("customLoader");

if (loader) {

loader.remove();



console.log("✅ Funny Loader Removed (Red-White Theme)");

}

}

// ✅ Save Order to Firebase Firestore (Updated to return Order ID)
async function saveOrderToFirebase(order) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-IN", { 
      day: "2-digit", month: "2-digit", year: "numeric", 
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: true 
    });

    const orderWithUID = {
      ...order,
      uid: user.uid,
      createdAt: formattedDateTime // Save formatted date-time
    };

    const docRef = await addDoc(collection(db, "orders"), orderWithUID);
    
    return docRef.id; // ✅ Return the Firestore Order ID
  } catch (error) {
    throw new Error("Firestore save failed: " + error.message);
  }
}

// ✅ Retrieve Payment Details

function getPaymentDetails() {

const paymentData = JSON.parse(sessionStorage.getItem("paymentDetails"));

if (paymentData) {

console.log("✅ Payment Data Retrieved:", paymentData);

return paymentData;

} else {

console.log("⚠️ No Payment Data Found.");

return null;

}

}
