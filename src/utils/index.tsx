const Ultils = class Ultils {
  static extractSrcFromIframe = (iframeString?: string): string | undefined => {
    if (!iframeString) return undefined;
    const match = iframeString.match(/src="([^"]*)"/);
    return match ? match[1] : undefined;
  };

  static formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    }
    return phone;
  };
};

export default Ultils;
