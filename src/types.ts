import React from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Doctor' | 'Pharmacist' | 'Accountant' | 'Admin' | 'Receptionist';

export interface User {
  id: string;
  name: string;
  role: Role;
  username: string;
  avatar: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export interface Patient {
  id: string;
  name: string;
  treatment: string;
  date: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Appointment {
  id: string;
  doctor: string;
  patient: string;
  type: string;
  time: string;
  color: string;
}
