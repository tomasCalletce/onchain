import { DEFI_LLAMA_API_URL, MANTLE_NETWORK } from "./constants";

export interface TokenPriceResponse {
  coins: {
    [key: string]: {
      price: number;
      timestamp: number;
      confidence: number;
    };
  };
}

export async function getTokenPrice(
  tokenAddress: string,
  network: string = MANTLE_NETWORK
): Promise<number | null> {
  try {
    const baseUrl = DEFI_LLAMA_API_URL;
    const endpoint = "/prices/current";
    const coinIdentifier = `${network}:${tokenAddress}`;

    const response = await fetch(`${baseUrl}${endpoint}/${coinIdentifier}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TokenPriceResponse;

    const coinData = data.coins[coinIdentifier];
    if (!coinData) {
      return null;
    }

    return coinData.price;
  } catch (error) {
    console.error("Error fetching token price:", error);
    return null;
  }
}
