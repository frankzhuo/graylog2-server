import Reflux from 'reflux';
import URI from 'urijs';

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';
import CombinedProvider from 'injection/CombinedProvider';

const { ConfigurationVariableActions } = CombinedProvider.get('ConfigurationVariable');

const ConfigurationVariableStore = Reflux.createStore({
  listenables: [ConfigurationVariableActions],
  sourceUrl: '/sidecar/configuration_variables',

  propagateChanges() {
    this.trigger({
      configurationVariables: this.configurationVariables,
    });
  },

  _fetchConfigurationVariables() {
    const baseUrl = `${this.sourceUrl}`;

    const uri = URI(baseUrl).toString();

    return fetch('GET', URLUtils.qualifyUrl(uri));
  },

  all() {
    const promise = this._fetchConfigurationVariables();
    promise
      .then(
        (response) => {
          this.configurationVariables = response.configurationVariables;
          this.propagateChanges();

          return response.configurationVariables;
        },
        (error) => {
          UserNotification.error(`Fetching configuration variables failed with status: ${error}`,
            'Could not retrieve configuration variables');
        });

    ConfigurationVariableActions.all.promise(promise);
  },

  save(configurationVariable) {
    const request = {
      id: configurationVariable.id,
      name: configurationVariable.name,
      description: configurationVariable.description,
      content: configurationVariable.content,
    };

    let url = URLUtils.qualifyUrl(`${this.sourceUrl}`);
    let method;
    if (configurationVariable.id === '') {
      method = 'POST';
    } else {
      url += `/${configurationVariable.id}`;
      method = 'PUT';
    }

    const promise = fetch(method, url, request);
    promise
      .then(() => {
        const action = configurationVariable.id === '' ? 'created' : 'updated';
        UserNotification.success(`Configuration variable "${configurationVariable.name}" successfully ${action}`);
      }, (error) => {
        UserNotification.error(`Saving variable "${configurationVariable.name}" failed with status: ${error.message}`,
          'Could not save variable');
      });

    ConfigurationVariableActions.save.promise(promise);
  },

  delete(configurationVariable) {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl}/${configurationVariable.id}`);
    const promise = fetch('DELETE', url);
    promise
      .then(() => {
        UserNotification.success(`Configuration variable "${configurationVariable.name}" successfully deleted`);
      }, (error) => {
        UserNotification.error(`Deleting variable "${configurationVariable.name}" failed with status: ${error.message}`,
          'Could not delete variable');
      });

    ConfigurationVariableActions.delete.promise(promise);
  },

  validate(configurationVariable) {
    const request = {
      id: configurationVariable.id,
      name: configurationVariable.name,
      description: configurationVariable.description,
      content: configurationVariable.content,
    };
    const url = URLUtils.qualifyUrl(`${this.sourceUrl}/validate`);
    const method = 'POST';

    const promise = fetch(method, url, request);
    promise
      .then(() =>
        response => response,
      (error) => {
        UserNotification.error(`Validating variable "${configurationVariable.name}" failed with status: ${error.message}`,
          'Could not validate variable');
      });

    ConfigurationVariableActions.validate.promise(promise);
  },

});

export default ConfigurationVariableStore;