import SoundTable from './components/SoundTable/SoundTable';
import AddingPanel from './components/AddingPanel/AddingPanel';
import QueryProvider from './components/QueryProvider/QueryProvider';

export default function Dashboard() {

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <QueryProvider>
          <AddingPanel/>
          <SoundTable/>
        </QueryProvider>
      </div>
    </div>
  );
};