import RoomCard from '@/components/RoomCard';
import Heading from '@/components/Heading';
import getAllRooms from './actions/getAllRooms';

export default async function Home() {
  const rooms = await getAllRooms();

  return (
    <>
    <Heading title={'Available Rooms'}/>
      {rooms.length > 0 && rooms ? (
        rooms.map((room) => {
          if(!room) return null;
         return (
          <RoomCard room={room} key={room.$id}/>
         )
        })
      ) : (
        <p>You have no rooms</p>
      )}
    </>
  );
}
