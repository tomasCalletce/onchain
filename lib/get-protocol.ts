interface ProtocolData {
  id: string;
  name: string;
  url: string;
  description: string;
  logo: string;
  gecko_id: string;
  cmcId: string;
  chains: string[];
  twitter?: string;
  github?: { [key: string]: string };
  currentChainTvls: { [key: string]: number };
  chainTvls: { [key: string]: any };
}

interface FilteredProtocolData
  extends Omit<ProtocolData, "currentChainTvls" | "chainTvls"> {
  currentChainTvls: { Mantle: number };
  chainTvls: { Mantle: any };
}

interface ProtocolStats {
  name: string;
  mantleTVL: number;
  chainDiversification: number;
  socialPresence: {
    hasTwitter: boolean;
    hasGithub: boolean;
    platformCount: number;
  };
  marketPresence: {
    hasCoinGecko: boolean;
    hasCMC: boolean;
  };
  summary: {
    category: "SMALL" | "MEDIUM" | "LARGE";
    isMultiChain: boolean;
    platformStrength: number;
  };
}

interface ProtocolSummary {
  name: string;
  tvl: number;
  health: {
    score: number;
    category: "LOW" | "MEDIUM" | "HIGH";
  };
  mantleShare: number;
  socialPresence: {
    hasTwitter: boolean;
    hasGithub: boolean;
    platformCount: number;
  };
  isMultiChain: boolean;
}

export async function getProtocolData(
  protocolSlug: string
): Promise<FilteredProtocolData> {
  try {
    const response = await fetch(
      `https://api.llama.fi/protocol/${protocolSlug}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ProtocolData = await response.json();

    const filteredData: FilteredProtocolData = {
      ...data,
      currentChainTvls: { Mantle: data.currentChainTvls.Mantle || 0 },
      chainTvls: { Mantle: data.chainTvls.Mantle || {} },
    };

    return filteredData;
  } catch (error) {
    console.error("Error fetching protocol data:", error);
    throw new Error("Failed to fetch protocol data from DeFi Llama");
  }
}

export async function getProtocolStats(
  protocolSlug: string
): Promise<ProtocolStats> {
  try {
    const data = await getProtocolData(protocolSlug);

    const totalTVL = Object.values(data.currentChainTvls).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
    const mantleTVL = data.currentChainTvls.Mantle || 0;

    const chainDiversification =
      totalTVL > 0 ? (mantleTVL / totalTVL) * 100 : 100;

    const getTVLCategory = (tvl: number): "SMALL" | "MEDIUM" | "LARGE" => {
      if (tvl < 100000) return "SMALL";
      if (tvl < 1000000) return "MEDIUM";
      return "LARGE";
    };

    const platformStrength =
      (data.twitter ? 20 : 0) +
      (data.github ? 20 : 0) +
      (data.gecko_id ? 20 : 0) +
      (data.cmcId ? 20 : 0) +
      (data.chains.length > 1 ? 20 : 10);

    return {
      name: data.name,
      mantleTVL,
      chainDiversification,
      socialPresence: {
        hasTwitter: !!data.twitter,
        hasGithub: !!data.github,
        platformCount: [data.twitter, data.github].filter(Boolean).length,
      },
      marketPresence: {
        hasCoinGecko: !!data.gecko_id,
        hasCMC: !!data.cmcId,
      },
      summary: {
        category: getTVLCategory(mantleTVL),
        isMultiChain: data.chains.length > 1,
        platformStrength,
      },
    };
  } catch (error) {
    console.error("Error generating protocol statistics:", error);
    throw new Error("Failed to generate protocol statistics");
  }
}

export async function getProtocolSummary(
  protocolSlug: string
): Promise<ProtocolSummary> {
  const stats = await getProtocolStats(protocolSlug);

  const getHealthCategory = (score: number): "LOW" | "MEDIUM" | "HIGH" => {
    if (score >= 80) return "HIGH";
    if (score >= 50) return "MEDIUM";
    return "LOW";
  };

  return {
    name: stats.name,
    tvl: stats.mantleTVL,
    health: {
      score: stats.summary.platformStrength,
      category: getHealthCategory(stats.summary.platformStrength),
    },
    mantleShare: Math.round(stats.chainDiversification),
    socialPresence: stats.socialPresence,
    isMultiChain: stats.summary.isMultiChain,
  };
}

export async function getMerchantMoeSummary(): Promise<ProtocolSummary> {
  try {
    return await getProtocolSummary("merchant-moe");
  } catch (error) {
    console.error("Error fetching Merchant Moe summary:", error);
    throw new Error("Failed to fetch Merchant Moe summary");
  }
}

export async function getTreeHouseProtocolSummary(): Promise<ProtocolSummary> {
  try {
    return await getProtocolSummary("treehouse-protocol");
  } catch (error) {
    console.error("Error fetching Tree House protocol summary:", error);
    throw new Error("Failed to fetch Tree House protocol summary");
  }
}
