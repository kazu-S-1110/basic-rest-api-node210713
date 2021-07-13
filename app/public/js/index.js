const indexModule = (() => {
//検索ボタンを押した時に発火するイベントリスナーを定義。
  document.getElementById("search-btn").addEventListener("click",() => {
    return searchModule.searchUsers()
  })


  //UserモジュールのfetchAllUsersメソッドを呼び出す
  // console.log("index display")
  return usersModule.fetchAllUsers()
})()