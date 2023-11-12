import Carousel from "./components/Carousel/Carousel";
import { v4 as uuidv4 } from 'uuid';
import QuickResponseCode from "./components/QuickResponseCode/QuickResponseCode";

export default function Home() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/room/${uuidv4()}/phone`;

  const [optionCarousel, setOptionCarousel] = 

  return (
    <main className='h-full w-full'>
      <div className="flex flex-col h-full">
        <div className="h-full flex items-center justify-center gap-20">
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">Applicant Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
          </div>
          <QuickResponseCode url={url}/>
          <div className="px-4 sm:px-0">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900">Applicant Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <Carousel/>
        </div>
        <div className="px-4 py-4 sm:px-6 text-center">
          <p>Film</p>
        </div>
      </div>
    </main>
  )
}


