import server from "./server";
import colors from 'colors'; 

const port = process.env.PORT || 3600

server.listen(port, () => {
    console.log(colors.blue(`REST API corriendo en el puerto ${port}`));
})