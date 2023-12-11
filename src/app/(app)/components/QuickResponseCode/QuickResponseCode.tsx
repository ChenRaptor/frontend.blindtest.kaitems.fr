import QRCode from 'react-qr-code';

export default function QuickResponseCode({url}: {url: string}) {
  return (
    <div>
      <QRCode bgColor="#00000000" value={url} className='w-full'/>
    </div>
  );
}