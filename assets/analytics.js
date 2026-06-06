(function () {
  const measurementId = "G-HRN5TZ61NL";

  if (!/^G-[A-Z0-9]+$/.test(measurementId) || measurementId.includes("REPLACE")) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    transport_type: "beacon",
  });
})();
