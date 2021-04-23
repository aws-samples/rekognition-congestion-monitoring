export const createJpegFile4Base64 = (base64: string, name: string): File => {
  const bin = atob(base64.replace(/^.*,/, ''));
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new File([buffer.buffer], name, { type: 'image/jpeg' });
};
