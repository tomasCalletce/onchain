interface StablecoinResponse {
  date: string;
  totalCirculating: {
    peggedUSD: number;
  };
  totalCirculatingUSD: {
    peggedUSD: number;
  };
  totalBridgedToUSD: {
    peggedUSD: number;
  };
}

export async function getStablecoinData(
  stablecoinId: number
): Promise<StablecoinResponse[]> {
  try {
    const response = await fetch(
      `https://stablecoins.llama.fi/stablecoincharts/Mantle?stablecoin=${stablecoinId}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching stablecoin data:", error);
    throw error;
  }
}
