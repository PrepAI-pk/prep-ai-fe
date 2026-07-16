export type BookmarkMap = Record<number, boolean>;

export type OptionVisualStyle = {
  borderColor: string;
  backgroundColor: string;
  opacity: number;
  letter: {
    borderColor?: string;
    backgroundColor: string;
    color: string;
  };
};
