document.getElementById("send-url").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const toleranceValue = document.getElementById("tolerance-input").value; // Tolerance değerini al
    const labelValue = document.getElementById("label-input").value; // Label değerini al

    console.log("Current URL:", url);
    console.log("Tolerance value:", toleranceValue);
    console.log("Label value:", labelValue);

    // URL'nin Street View olup olmadığını kontrol et
    if (url.includes("google.com/maps") && url.includes("streetview")) {
      fetch("https://localhost:7117/api/StreetView/RegisterPanorama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          viewTolerance: toleranceValue ? parseInt(toleranceValue) : null,
          label: labelValue,
        }), // Tolerance ve Label ekle
      })
        .then((response) => {
          console.log("response");
          console.log(response);

          if (!response.ok) {
            // Hata durumları için mesaj göster
            switch (response.status) {
              case 400:
                showToast("Bad Request: Please check your request.");
                break;
              case 404:
                showToast(
                  "Not Found: The requested resource could not be found."
                );
                break;
              case 500:
                showToast("Internal Server Error: A server error occurred.");
                break;
              default:
                showToast("An error occurred: " + response.status);
            }
            return Promise.reject(response);
          }
          return response.json();
        })
        .then((data) => {
          console.log("URL sent to backend:", data);
          showToast("Location successfully added!");
        })
        .catch((error) => {
          console.log("Error sending URL:", error);
          if (error instanceof Response) {
            // Eğer bir Response hatası varsa burada işleyebiliriz
          } else {
            showToast("Response could not be received.");
          }
        });
    } else {
      showToast("Please be in Street View mode!");
    }
  });
});

// Toast mesajını göster ve gizle
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 saniye boyunca göster
}
