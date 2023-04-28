import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function ToastContainerCustom() {
	return (
		<ToastContainer
			position="top-right"
			autoClose={800}
			hideProgressBar
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="light"
			limit={2}
		/>
	);
}

export { toast, ToastContainerCustom };
