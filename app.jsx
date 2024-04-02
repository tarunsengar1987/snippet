import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Router, Route, Redirect, Switch
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataIndicator from './components/dataIndicator/containers/DataIndicator';
import Wrapper from './layouts/containers/Wrapper';
import PresentationSlide from './pages/presentation/containers/PresentationSlide';
import NotFoundPage from './pages/warnings/NotFoundPage';
import { redirects } from './routes/Routes';
import { settingsLinks, reviewerLinks, setupLinks } from './routes/links';
import routeComponents from './routes/components';
import history from './history';
import BrandPlanService from './services/brandPlanService';
import { getCorrectModuleKey } from './helpers';
import { getAllComments } from './store/comments/action';

const extraRoutes = [...settingsLinks, ...reviewerLinks, ...setupLinks];

const App = ({ isEditMode, routes }) => {
  const hasRoutes = !!routes.length;
  const dispatch = useDispatch();
  const currentModule = useSelector(state => state?.brandPlans?.activeModule);

  const fetchAllStickers = async () => {
    const result = await BrandPlanService.getStickers(
      getCorrectModuleKey(currentModule)
    );

    if (result?.message === 'Success') {
      dispatch(getAllComments(result?.stickerData));
    }
  };

  useEffect(() => {
    if (!currentModule) return;

    fetchAllStickers();
  }, [currentModule]);

  return (
    <Router history={history}>
      <div className={`App${isEditMode ? ' editMode' : ''}`}>
        <DataIndicator />
        {hasRoutes && (
          <Switch>
            {routes.map(route => (
              <Route
                key={`route-${route.label}`}
                exact
                path={route.path}
                render={() => (
                  <Wrapper
                    {...routeComponents[route.name]}
                    title={route.label}
                  />
                )}
              />
            ))}
            {redirects.map(route => (
              <Route
                key={`redirect-${route.path}`}
                exact
                path={route.path}
                render={() => <Redirect to={route.redirect} />}
              />
            ))}
            {extraRoutes.map(route => (
              <Route
                key={`extra-${route.path}`}
                exact
                path={route.path}
                render={() => (
                  <Wrapper
                    {...routeComponents[route.name]}
                    title={route.label}
                  />
                )}
              />
            ))}
            <Route
              render={() => (
                <Wrapper component={NotFoundPage} title="Page not found" />
              )}
            />
          </Switch>
        )}
        <Route
          exact
          path="/slide/:presentationId/:id"
          component={PresentationSlide}
        />
      </div>
    </Router>
  );
};

App.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default App;
