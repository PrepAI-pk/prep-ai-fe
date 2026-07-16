export interface IUnlockBadge {
  sym: string;
  name: string;
  xp: number;
  description?: string;
}

export interface BadgeUnlockOverlayProps {
  unlockOverlayOpen: boolean;
  unlockedBadge: IUnlockBadge | null;
  earnedXp: number;
  setUnlockOverlayOpen: (open: boolean) => void;
}
