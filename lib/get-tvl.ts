interface TvlDataPoint {
  date: number;
  tvl: number;
}

export async function getHistoricalTVL(): Promise<TvlDataPoint[]> {
  try {
    const response = await fetch(
      "https://api.llama.fi/v2/historicalChainTvl/mantle"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TVL data:", error);
    throw new Error("Failed to fetch TVL data from DeFi Llama");
  }
}
