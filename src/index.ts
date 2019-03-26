import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab_gitpuller extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_gitpuller',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab_gitpuller is activated!');
  }
};

export default extension;
