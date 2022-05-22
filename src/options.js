import * as ReactDOM from 'react-dom/client';
import App from "./_options/app";

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);