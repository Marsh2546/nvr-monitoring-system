// Mock NVR data for development
import { NVRStatus } from '../types/nvr';

export const mockNVRData: NVRStatus[] = [
  {
    id: "1",
    nvr: "AC-JJ-10-A",
    location: "อาคาร A",
    district: "เขตพระนคร",
    onu_ip: "192.168.1.100",
    ping_onu: true,
    nvr_ip: "192.168.1.101",
    ping_nvr: true,
    hdd_status: true,
    normal_view: true,
    check_login: true,
    camera_count: 4,
    date_updated: new Date().toISOString(),
  },
  {
    id: "2",
    nvr: "AC-JJ-11-B",
    location: "อาคาร B",
    district: "เขตดุสิต",
    onu_ip: "192.168.1.102",
    ping_onu: false,
    nvr_ip: "192.168.1.103",
    ping_nvr: true,
    hdd_status: true,
    normal_view: true,
    check_login: true,
    camera_count: 2,
    date_updated: new Date().toISOString(),
  }
];

export default mockNVRData;
