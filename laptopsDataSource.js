export async function fetchLaptops() {
  try {
    const RESPONSE = await fetch(
      "https://hickory-quilled-actress.glitch.me/computers"
    );
    const LAPTOPS = await RESPONSE.json();
    return LAPTOPS;
  } catch (error) {
    console.error("Error: ", error);
  }
}
