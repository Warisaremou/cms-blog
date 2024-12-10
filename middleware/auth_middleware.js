const authMiddleware = async (req, res) => {
	const token = await req.headers.authorization.slice(7);

	if (!token) {
		res.status(403).json({
			message: "Token not found",
		});
	}

	const isValidToken = await decodeToken(token);
};

export { authMiddleware };
