import "~css/reset-pc.css";
import React, { Fragment } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import routes from "./route";
import { history } from "~js/utils/utils";
import HasLayoutPages from "~js/components/HasLayoutPages/Index";

const NoLayoutPages = [];
const LayoutPages = [];
Object.keys(routes).forEach(path => {
  const route = routes[path];
  const { layout = true, exact = true, ...restProps } = route;
  const props = { key: path, path, exact, ...restProps };

  if (layout) {
    LayoutPages.push(props);
  } else {
    NoLayoutPages.push(props);
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          {NoLayoutPages.map(({ component: Component, ...restProps }) => (
            <Route {...restProps} render={props => <Component {...props} />} />
          ))}
          <Route
            render={props => (
              <HasLayoutPages history={history}>
                {id => (
                  <Switch>
                    {LayoutPages.map(
                      ({ component: Component, ...restProps }) => (
                        <Route
                          {...restProps}
                          render={props => <Component id={id} {...props} />}
                        />
                      )
                    )}
                    <Redirect to="/404"></Redirect>
                  </Switch>
                )}
              </HasLayoutPages>
            )}
          />
        </Switch>
      </Router>
    );
  }
}
