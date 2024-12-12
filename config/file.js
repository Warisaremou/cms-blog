import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	// destination: "uploads/",
	filename: function (req, file, callback) {
		const uniqueSuffix = Date.now() + path.extname(file.originalname);
		callback(null, file.fieldname + "-" + uniqueSuffix);
	},
});

const checkFileType = (file, callback) => {
	const filetypes = /jpeg|jpg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return callback(null, true);
	} else {
		callback("Error: Images only! (jpeg, jpg, png)");
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 2000000, // Limit file size to 2MB
	},
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
}).single("image");

export { upload };
