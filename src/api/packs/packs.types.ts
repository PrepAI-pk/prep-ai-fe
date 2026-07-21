export type PackState = "AVAILABLE" | "DOWNLOADING" | "DONE";

export type PackItem = {
  id: string;
  name: string;
  desc: string;
  mb: number;
  state: PackState;
  prog?: number;
};

export type GetPacksResponse = {
  offlineEnabled: boolean;
  storage: { usedMb: number; quotaMb: number; packCount: number };
  items: PackItem[];
};
