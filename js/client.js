(function () {
  'use strict';

  	function getMobileOperatingSystem() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (/windows phone/i.test(userAgent)) {
		    return "Windows Phone";
		}

		if (/android/i.test(userAgent)) {
		    return "Android";
		}

		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		    return "iOS";
		}

		return "unknown";
	}

	function DetectAndServe(){
	    let os = getMobileOperatingSystem();
	    var menu = document.querySelector("#mal_eng");
	    if (os == "Android") {
	        menu.href = "https://play.google.com/store/apps/details?id=org.syromalabar.stthomas"; 
	    } else if (os == "iOS") {
	        menu.href = "https://apps.apple.com/in/app/syro-malabar/id989226460";
	    } else if (os == "Windows Phone") {
	        menu.href = "https://play.google.com/store/apps/details?id=org.syromalabar.stthomas";
	    } else {
	        menu.href = "https://play.google.com/store/apps/details?id=org.syromalabar.stthomas";
	    }
	}

	DetectAndServe();

})();