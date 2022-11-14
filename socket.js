const { getDataForAll } = require("./updateDataBase");

function updateSocketDB(socket) {
  console.log(`User ${socket.id} is connected.`);
  socket.on("try", () => {
    console.log("Start update => ");
    let i = 0;
    const t = setInterval(() => {
      if (i === 11) {
        socket.emit("db-message", {
          tasks: 10,
          currTask: i,
          message: `Taks: ${i}`,
          finished: true,
        });
        return clearInterval(t);
      } else {
        socket.emit("db-message", {
          tasks: 10,
          currTask: i,
          message: `Taks: ${i}`,
          finished: false,
        });
        i++;
      }
    }, 2000);
  });

  socket.on("update-db", async () => {
    const responseData = await getDataForAll(socket);
    socket.emit("db-message", { finished: true, ...responseData});
  })

  socket.on("disconnect", () => console.log(`User ${socket.id} left`));
}

module.exports = {
  updateSocketDB,
};
