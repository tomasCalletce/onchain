interface TokenPrice {
  decimals: number;
  price: number;
  symbol: string;
  timestamp: number;
  confidence?: number;
}

interface TokenPriceResponse {
  coins: {
    [key: string]: TokenPrice;
  };
}

export async function getTokenPrice(
  contractAddress: string
): Promise<TokenPrice> {
  try {
    const baseUrl = "https://coins.llama.fi";
    const endpoint = "/prices/current";
    const chainPrefix = "mantle";

    const tokenIdentifier = `${chainPrefix}:${contractAddress}`;

    const response = await fetch(`${baseUrl}${endpoint}/${tokenIdentifier}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as TokenPriceResponse;

    return data.coins[tokenIdentifier];
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
}
