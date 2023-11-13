import QRCode from 'react-qr-code';

export default function QuickResponseCode({url}: {url: string}) {
  return (
    <div>
      <QRCode bgColor="#d4d4d4" size={384} value={url} />
    </div>
  );
}