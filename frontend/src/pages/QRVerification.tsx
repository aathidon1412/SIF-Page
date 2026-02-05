import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { API_BASE } from '../services/api';
import toast from 'react-hot-toast';

interface VerificationResult {
  valid: boolean;
  status: 'valid' | 'invalid' | 'expired' | 'not_yet_valid' | 'not_approved' | 'error';
  message: string;
  bookingInfo?: {
    id: string;
    itemTitle: string;
    itemType: string;
    userName: string;
    userEmail: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    purpose: string;
    verificationCount: number;
  };
}

export default function QRVerification() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  const startScanner = async () => {
    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
      toast.success('Scanner started. Point camera at QR code.');
    } catch (err: any) {
      console.error('Scanner start error:', err);
      toast.error(err.message || 'Failed to start scanner. Please check camera permissions.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Scanner stop error:', err);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    await stopScanner();
    await verifyToken(decodedText);
  };

  const onScanError = (errorMessage: string) => {
    if (!errorMessage.includes('NotFoundException')) {
      console.warn('QR Scan error:', errorMessage);
    }
  };

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/verify/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data: VerificationResult = await response.json();
      setResult(data);

      if (data.valid) {
        toast.success('Booking verified successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorResult: VerificationResult = {
        valid: false,
        status: 'error',
        message: 'Failed to verify booking. Please try again.',
      };
      setResult(errorResult);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, []);

  const resetScanner = () => {
    setResult(null);
    startScanner();
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'valid':
        return { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: '✓', title: 'Valid Booking' };
      case 'expired':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: '⏰', title: 'Expired' };
      case 'not_yet_valid':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: '⏳', title: 'Not Yet Valid' };
      case 'not_approved':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: '⚠️', title: 'Not Approved' };
      default:
        return { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: '✗', title: 'Invalid' };
    }
  };

  const statusDisplay = result ? getStatusDisplay(result.status) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Verification</h1>
          <p className="text-gray-600 text-lg">Scan QR codes to verify facility bookings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              {!scanning && !result && (
                <button onClick={startScanner} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">Start Scanner</button>
              )}
              {scanning && (
                <button onClick={stopScanner} className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">Stop Scanner</button>
              )}
              {result && !scanning && (
                <button onClick={resetScanner} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">Scan Another</button>
              )}
            </div>

            <div className="flex justify-center">
              <div id={qrCodeRegionId} className={`${scanning ? 'border-2 border-blue-500' : ''} rounded-lg overflow-hidden`} style={{ width: '100%', maxWidth: '500px' }} />
            </div>

            {isVerifying && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Verifying booking...</p>
              </div>
            )}
          </div>
        </div>

        {result && !isVerifying && statusDisplay && (
          <div className={`${statusDisplay.bgColor} ${statusDisplay.borderColor} border-2 rounded-2xl shadow-lg p-6 mb-6`}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{statusDisplay.icon}</div>
              <h2 className={`text-3xl font-bold ${statusDisplay.color}`}>{statusDisplay.title}</h2>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-center text-lg">{result.message}</p>
            </div>

            {result.valid && result.bookingInfo && (
              <div className="bg-white rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Booking ID</p>
                    <p className="text-gray-900 font-mono text-sm">{result.bookingInfo.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Item</p>
                    <p className="text-gray-900 font-semibold">{result.bookingInfo.itemTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Type</p>
                    <p className="text-gray-900 capitalize">{result.bookingInfo.itemType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">User Name</p>
                    <p className="text-gray-900">{result.bookingInfo.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 text-sm">{result.bookingInfo.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Start</p>
                    <p className="text-gray-900">{result.bookingInfo.startDate} {result.bookingInfo.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">End</p>
                    <p className="text-gray-900">{result.bookingInfo.endDate} {result.bookingInfo.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Verification Count</p>
                    <p className="text-gray-900">{result.bookingInfo.verificationCount}</p>
                  </div>
                </div>

                {result.bookingInfo.purpose && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 font-medium">Purpose</p>
                    <p className="text-gray-900">{result.bookingInfo.purpose}</p>
                  </div>
                )}
              </div>
            )}

            {!result.valid && result.bookingInfo && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Item:</span> {result.bookingInfo.itemTitle}</p>
                  <p><span className="font-medium">User:</span> {result.bookingInfo.userName}</p>
                  <p><span className="font-medium">Status:</span> {result.status.replace('_', ' ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!scanning && !result && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Start Scanner" to activate the camera</li>
              <li>Point the camera at a booking QR code</li>
              <li>The system will automatically scan and verify the booking</li>
              <li>View the verification result and booking details</li>
              <li>Click "Scan Another" to verify additional bookings</li>
            </ol>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800"><strong>Note:</strong> You can verify bookings starting 30 minutes before their scheduled time. Each scan is logged for security purposes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
