const indexModule = (() => {
  //UserモジュールのfetchAllUsersメソッドを呼び出す
  return usersModule.fetchAllUsers()
  console.log("index display")
})()