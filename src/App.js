import { BrowserRouter, Routes,Route } from "react-router-dom";
import Artistpage from "./page/Artistpage.js";
import Profile from "./page/Profile.js";
import SignPage from "./page/SignPage.js";
import {path_browser} from "./utils/constant.js"
import Page from "./page/page.js";
import StackMusic from "./component/StackMusic.js";
function App() {
  return (
    <BrowserRouter>
    <Routes>
          {/* Page */}
          <Route path={path_browser.HOME} element={<Page/>}>
                {/*your path is seem like parent element */}
                <Route index element={<StackMusic/>}></Route>
                {/* The below specifices path will be render and if your path not in the list
                  , it goes to NOTFOUND Page for you
                */}
                <Route path={path_browser.ARTIST} element={<Artistpage/>}></Route>
                <Route path={path_browser.PROFILE} element={<Profile/>}></Route>
          </Route>
          <Route path={path_browser.SIGN} element={<SignPage/>}> </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
