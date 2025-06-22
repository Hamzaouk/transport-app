const notifyShippersAboutNewAnnouncement = async (announcement) => {
  // Trouver des expéditeurs susceptibles d’être intéressés (en fonction de la destination et des types de colis
  const shippers = await User.find({ 
    role: 'shipper',
  });
  
  await Notification.insertMany(
    shippers.map(shipper => ({
      user: shipper._id,
      title: 'New Shipping Announcement',
      message: `A new route to ${announcement.destination} is available`,
      type: 'announcement',
      relatedEntity: announcement._id
    }))
  );
  
};