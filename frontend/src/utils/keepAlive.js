const BACKEND_URL = "https://typing-website-f8me.onrender.com";

export const startKeepAlive = () => {
  const ping = async () => {
    try {
      await fetch(`${BACKEND_URL}/`);
      console.log("Server pinged ✅");
    } catch {
      console.log("Ping failed ❌");
    }
  };

  ping(); // ping immediately on load
  setInterval(ping, 14 * 60 * 1000); // then every 14 minutes
};