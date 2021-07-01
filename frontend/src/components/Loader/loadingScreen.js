import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import 'components/Loader/loadingScreenStyle.css';

export default function LoadingScreen (props) {
  const { loading } = props;
  return (
    <>
    {loading ? (
      <div className="backdrop">
        <PulseLoader size={30} loading={loading} />
      </div>
    ) : ''}
    </>
  );
}