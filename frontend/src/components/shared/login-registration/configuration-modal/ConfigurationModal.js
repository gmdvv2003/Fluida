import React, { useState } from 'react';
import { useAuthentication } from "context/AuthenticationContext";

import "./ConfigurationModal.css";

function ConfigurationModal() {
  const { logout } = useAuthentication();
  
  // Estado para armazenar qual div está sendo hover
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (section) => setHovered(section);
  const handleMouseLeave = () => setHovered(null);

  return (
    <div className="CM-fluida-container">
      <div 
        className="CM-option-account-container"
        onMouseEnter={() => handleMouseEnter('account')}
        onMouseLeave={handleMouseLeave}
      >
        {hovered === 'account' ? (
          <div className="CM-centered-text">Em desenvolvimento</div>
        ) : (
          <>
            <h1 className="CM-title-option">CONTA</h1>
            <a className="CM-text-option">
              Gerenciar conta
            </a>
          </>
        )}
      </div>
      <hr className="CM-hr-divider" />
      <div 
        className="CM-option-configuration-container"
        onMouseEnter={() => handleMouseEnter('configuration')}
        onMouseLeave={handleMouseLeave}
      >
        {hovered === 'configuration' ? (
          <div className="CM-centered-text">Em desenvolvimento</div>
        ) : (
          <>
            <h1 className="CM-title-option">FLUIDA</h1>
            <a className="CM-text-option">
              Configurações
            </a>
          </>
        )}
      </div>
      <hr className="CM-hr-divider" />
      <div className="CM-option-logout-container">
        <a className="CM-text-option" onClick={logout}>
          Fazer logout
        </a>
      </div>
    </div>
  );
}

export default ConfigurationModal;
