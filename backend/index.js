const { Permit } = require("permitio");
const cors = require('cors');
const express = require("express");
const app = express();
const port = 4000;
console.log(port);

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend
    methods: "GET, POST, PUT, DELETE", // Adjust allowed methods as needed
    credentials: true, // If using cookies or auth headers
  })
);

app.use(express.json()); // Middleware to parse JSON requests
// This line initializes the SDK and connects your Node.js app
// to the Permit.io PDP container you've set up in the previous step.
const permit = new Permit({
  // in production, you might need to change this url to fit your deployment
  pdp: 'https://cloudpdp.api.permit.io',
  // your secret API Key
  token: process.env.NEXT_PUBLIC_PERMIT_API_KEY,
});

// You can open http://localhost:4000 to invoke this http
// endpoint, and see the outcome of the permission check.
app.get("/", async (req, res) => {
  try {
    const user = {
      id: '2',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    };

    const permitted = await permit.check(user.id, 'edit', 'event'); // Use user.id
    console.log("Permit Check Result:", permitted); // More descriptive log

    if (permitted) {
      res.status(200).json({ permitted: true, message: `${user.firstName} ${user.lastName} is PERMITTED to 'modify' 'venue' !` }); // Send JSON
    } else {
      res.status(200).json({ permitted: false, message: `${user.firstName} ${user.lastName} is NOT PERMITTED to 'modify' 'venue' !` }); // Send JSON
    }
  } catch (error) {
    console.error("Error during permission check:", error); // Log the actual error
    res.status(500).json({ error: "An error occurred during permission check." }); // Send a 500 error
  }
});

console.log('amen')


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});