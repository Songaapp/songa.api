import app from "./app";
import swaggerDocs from "./swagger";

const PORT: Number = 3000;

app.listen(PORT, (): void => {
  console.log(`running on port ${PORT}`);
  swaggerDocs(app, PORT);
});
