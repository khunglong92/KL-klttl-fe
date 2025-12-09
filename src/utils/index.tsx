const Ultils = class Ultils {
  static extractSrcFromIframe = (iframeString?: string): string | undefined => {
    if (!iframeString) return undefined;
    const match = iframeString.match(/src="([^"]*)"/);
    return match ? match[1] : undefined;
  };
};

export default Ultils;
