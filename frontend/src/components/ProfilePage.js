import React, { useEffect, useState } from 'react';
import '../CSS/profilePage.css';
import CampaignCard from './CampaignCard';

const MyDonations = ({ user }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaigns associated with the user ID
    fetchDonatedCampaigns(user._id);
  }, [user]);

  const fetchDonatedCampaigns = (userId) => {
    fetch(`http://localhost:4000/fetchDonatedCampaigns/${userId}`)
      .then(response => response.json())
      .then(data => {
        setCampaigns(data.campaigns);
        // console.log(data.campaigns); // Move the logging here
        // console.log(data.campaigns.length); // Move the logging here
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  };

  return (
    <>
      <h2>My Donations</h2>
      <div className="campaign-list">
        {campaigns.map(campaign => (
          <CampaignCard key={campaign._id} campaign={campaign} role={"user"} />
        ))}
      </div>
    </>
  );
};

const MyCampaigns = ({ user }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaigns associated with the user ID
    fetchCampaigns(user._id);
  }, [user]);

  const fetchCampaigns = (userId) => {
    // console.log(userId+"id")
    // Assuming you have an API endpoint to fetch campaigns based on user ID
    fetch(`http://localhost:4000/fetchCampaignsOfUser/${userId}`)
      .then(response => response.json())
      .then(data => setCampaigns(data))
      .catch(error => console.error('Error fetching campaigns:', error));
  };

  return (
    <>
      <h2>My Campaigns</h2>
      <div className="campaign-list">
        {campaigns.map(campaign => (
          <CampaignCard campaign={campaign} role={"user"} />
        ))}
      </div>
    </>
  );
};


const UpcomingRides=({user , volunteeredRides , setVolunteeredRides})=>{

  const [address , setAddress] = useState('');
  const [file , setFile] = useState(null);
  // const [status , setStatus ] = useState(0);

  const handlePicked = async (rideId) => {
    try{
      const response = await fetch(`http://localhost:4000/handlePick/${rideId}` , {
          method:'PUT',
      });

      fetchVolunteeredRides(user._id);
  }
  catch(error){
      console.log(error);
      console.log("Error handling volunteer");
  }
  }

  const handleDelivery = async (event , rideId) => {
    event.preventDefault();
    try{

      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('files', file);
      formData.append('address' , address);

      const response = await fetch(`http://localhost:4000/handleDelivery/${rideId}` , {
        method:'POST',
        body: formData,
      });

      const data = await response.json();
      // console.log("Delivery Successful" , data);
      fetchVolunteeredRides(user._id);
    }
    catch(error){
      console.log(error);
      console.log("Error handling Delivery")
    }
  }
  
  const fetchVolunteeredRides = (userId) =>{
    fetch(`http://localhost:4000/volunteeredRides/${userId}`)
    .then(response => response.json())
    .then( data => setVolunteeredRides(data))
    .catch(error => console.log(error) );
  }

  useEffect(()=>{
    fetchVolunteeredRides(user._id);
  } , [volunteeredRides]);

  return(
  <>
 <h2>Volunteered Rides</h2>
 <div >
        {volunteeredRides.map(ride => (
          <div key={ride._id}>
            <p>Donor : {ride.donor.username}</p>
            <p>Items : {ride.donation.itemsType.join(' , ')}</p>
            <p>Pickup Address : {ride.donation.pickupAddress} , {ride.donation.city} , {ride.donation.pincode} , {ride.donation.state} </p>
            <p> Date : {ride.donation.scheduledDate.split('T')[0]} </p>
            <p>Contact : {ride.donation.contact}</p>
            {
              (ride.status === "volunteered") && (
                <button onClick={() => handlePicked(ride._id)} className='bg-green-400'>Picked</button>
              )
            }
            {
              (ride.status === "picked") && (
                <div>
                <form onSubmit={(event)=>handleDelivery( event , ride._id)}>
                  <input type='file' name='files' onChange={(e) => setFile(e.target.files[0])}/>
                  <button type='submit' className='bg-green-400'>Delivered</button>
                </form>
                </div>
              )
            }

          </div>
        ))}
      </div>
  </>);
}

const DoneRides=({user , volunteeredRides})=>{

  const [completedRides , setcompletedRides] = useState([]);
  
  const fetchCompletedRides = (userId) =>{
    fetch(`http://localhost:4000/completedRides/${userId}`)
    .then(response => response.json())
    .then( data => setcompletedRides(data))
    .catch(error => console.log(error) );
  }

  useEffect(()=>{
    fetchCompletedRides(user._id);
  } , [user , volunteeredRides , completedRides ]);


  return(
  <>
  <h2>Completed Rides</h2>
  <div className='flex' >
        {completedRides.map(ride => (
          <div className='bg-blue-500' key={ride._id}>
            <p>Donor : {ride.donor.username}</p>
            <p>Items : {ride.donation.itemsType.join(' , ')}</p>
            <p>Pickup Address : {ride.donation.pickupAddress} , {ride.donation.city} , {ride.donation.pincode} , {ride.donation.state} </p>
            <p> Date : {ride.donation.scheduledDate.split('T')[0]} </p>
            <p>Contact : {ride.donation.contact}</p>
          </div>
        ))}
      </div>
  </>);
}

const InitiatedRides = ({user}) => {

  const [initiatedRides , setInitiatedRides] = useState([]);
  
  const fetchInitiatedRides = (userId) =>{
    fetch(`http://localhost:4000/initiatedRides/${userId}`)
    .then(response => response.json())
    .then( data => setInitiatedRides(data))
    .catch(error => console.log(error) );
  }

  useEffect(()=>{
    fetchInitiatedRides(user._id);
  } , [user]);


  return(
  <>
  <h2>Initiated Rides</h2>
  <div className='flex' >
    {
      initiatedRides && 
      (initiatedRides.map(ride => (
          <div className='bg-yellow-500' key={ride._id}>
            <p>Items : {ride.donation.itemsType.join(' , ')}</p>
            <p>Pickup Address : {ride.donation.pickupAddress} , {ride.donation.city} , {ride.donation.pincode} , {ride.donation.state} </p>
            <p> Date : {ride.donation.scheduledDate.split('T')[0]} </p>
            <p>Rider : {ride.volunteer.username}</p>
            {
              ride.imageUrl && (
                <p>Image Url : <a href={ride.imageUrl} target='_blank'>
                  <img src={ride.imageUrl} alt='Your Image' />
                </a></p>
              )
            }
            {
              !ride.imageUrl && (
                <p>Not delivered</p>
              )
            }
          </div>
        )))
    }
    {
      !initiatedRides && (
        <p>No ride initiated</p>
      )
    }
      </div>
  </>);
}

const UserProfile = ({ user }) => {
  return (
    <div className="col-sm-4 bg-c-lite-green user-profile">
      <div className="card-block text-center text-white">
        <div className="m-b-25">
          <img src="https://img.icons8.com/bubbles/100/000000/user.png" className="img-radius" alt="User-Profile-Image" />
        </div>
        <h6 className="f-w-600">{user.name}</h6>
        <p>{user.role}</p>
        <i className="mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
      </div>
    </div>
  );
};

const UserInfo = ({ user }) => {
  return (
    <div className="col-sm-8">
      <div className="card-block">
        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
        <div className="row">
          <div className="col-sm-6">
            <p className="m-b-10 f-w-600">Email</p>
            <h6 className="text-muted f-w-400">{user.email}</h6>
          </div>
          <div className="col-sm-6">
            <p className="m-b-10 f-w-600">Phone</p>
            <h6 className="text-muted f-w-400">1111111111</h6>
          </div>
        </div>
        <ul className="social-link list-unstyled m-t-40 m-b-10">
          <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i className="mdi mdi-facebook feather icon-facebook facebook" aria-hidden="true"></i></a></li>
          <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i className="mdi mdi-twitter feather icon-twitter twitter" aria-hidden="true"></i></a></li>
          <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i className="mdi mdi-instagram feather icon-instagram instagram" aria-hidden="true"></i></a></li>
        </ul>
      </div>
    </div>
  );
};

const UserCard = ({ user , volunteeredRides , setVolunteeredRides }) => {
  return (
    <div className="col-xl-6 col-md-12">
      <div className="card user-card-full">
        <div className="row m-l-0 m-r-0">
          <UserProfile user={user} />
          <UserInfo user={user} />
          <MyDonations user={user}/>
          <MyCampaigns user={user}/>
          <UpcomingRides user={user} volunteeredRides={volunteeredRides} setVolunteeredRides={setVolunteeredRides}  />
          <DoneRides user={user} volunteeredRides={volunteeredRides} />
          <InitiatedRides user={user} />
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [volunteeredRides , setVolunteeredRides] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch('http://localhost:4000/fetchUserDetails', {
          method: 'GET',
          headers: {
            cookies: document.cookie
          }
        });
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.log("error=" + error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  return (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="row container d-flex justify-content-center">
            <UserCard user={user} volunteeredRides={volunteeredRides} setVolunteeredRides={setVolunteeredRides}  />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
