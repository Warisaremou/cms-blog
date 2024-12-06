import { db } from "../config/database.js";


/**
 * FUNCTION TO REGISTER USER
 */
const register = async (req, res) => {

  try {
    const data = await db.execute(`INSERT INTO users(username, surname, firstname, email, password, id_role) VALUES ('${req.body.username}','${req.body.surname}','${req.body.fisrtname}','${req.body.email}','${req.body.password}',${req.body.id_role})`)
    

    console.log("-------",data)

    res.json({
      message: 'Account created successfully'
    })
  } catch (error) {
    return res.status(500).json({
			error: error.message,
		});
  }
} 

export {register};