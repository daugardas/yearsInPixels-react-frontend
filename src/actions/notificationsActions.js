export const createNotification = (type, text) => {
  return { type: "CREATE_NOTIFICATION", payload: { notification: {type, text}}};
}

export const deleteNotification = id => {
  return { type: "DELETE_NOTIFICATION", payload: {id}};
}

export const deleteAllNotifications = () => {
  return {type: "DELETE_ALL_NOTIFICATIONS"};
}