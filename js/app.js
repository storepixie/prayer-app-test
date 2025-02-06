(function () {
  var worker = 'sw.js';

    if ("serviceWorker" in navigator) {
      	window.addEventListener("load", function() {
            navigator.serviceWorker.register(worker).then(function(reg) {
                 console.log('Service Worker registered with scope: ', registration.scope);
                reg.onupdatefound = function() {
                    var installingWorker = reg.installing;

                    installingWorker.onstatechange = function() {
                        switch (installingWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                   clients.matchAll().then(function(clients) {
                                        clients.forEach(function(client) {
                                          client.postMessage({ action: "newVersionAvailable" });
                                        });
                                    });
                                } else {
                                    // console.log('Content is now available offline!');
                                }
                                break;

                            case 'redundant':
                                // console.error('The installing service worker became redundant.');
                                break;
                        }
                    };
                };
            }).catch(function(e) {
                // console.error('Error during service worker registration:', e);
            });
      	})

        window.addEventListener('focus', function () {
            navigator.serviceWorker.ready.then(function (registration) {
              // Force the service worker to check for updates when app is reopened
              registration.update().then(() => {
                console.log('Checked for new service worker!');
                // You can also check if the new service worker is different and show a prompt
                if (registration.waiting) {
                  // A new service worker is waiting to be activated
                  registration.waiting.postMessage({ action: 'skipWaiting' });  // Force activation
                }
              });
            });
        });

        if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'newVersionAvailable') {
      showUpdateBanner();
    }
  });
}
	}

})();



function showUpdateBanner() {
  const banner = document.getElementById('update-banner');
  const reloadBtn = document.getElementById('reload-btn');
  
  banner.style.display = 'block'; // Show the banner

  reloadBtn.addEventListener('click', function() {
    window.location.reload(); // Refresh the page to load the new version
  });
}

let deferredPrompt;  // Store the event to trigger the installation later
const installButton = document.getElementById('install-button'); // Your custom button

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar
    e.preventDefault();
    // Store the event to trigger it later
    deferredPrompt = e;
    
    // Show your custom install button
    installButton.style.display = 'block';

    // When the user clicks the install button, show the prompt
    installButton.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation');
            } else {
                console.log('User dismissed the installation');
            }
            // Clear the deferredPrompt variable since it's no longer needed
            deferredPrompt = null;
        });
    });
});
