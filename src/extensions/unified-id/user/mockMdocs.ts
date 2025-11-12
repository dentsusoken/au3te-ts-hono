/*
 * Copyright (C) 2014-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */

import { Mdocs } from '@vecrea/au3te-ts-common/handler.user';

export const mockMdocs: { [subject: string]: Mdocs } = {
  '1004': {
    'com.dentsusoken.vecrea.UnifiedID': {
      'com.dentsusoken.vecrea': {
        issue_date: 'cbor:0("2025-06-18T12:54:00Z")',
        expiry_date: 'cbor:0("2026-06-18T12:59:00Z")',
        type: 'UnifiedID',
        issuer: 'Unified ID VC Issuer',
        service: 'ShopVC',
        user_id: '44da59c4-b2a0-4a3a-83c0-8b2d95b639cb',
        unified_id: 'e21d5f6b-1a97-4767-839e-0c688ca561a2',
      },
    },
  },
  '1005': {
    'com.dentsusoken.vecrea.UnifiedID': {
      'com.dentsusoken.vecrea': {
        issue_date: 'cbor:0("2025-06-18T12:54:00Z")',
        expiry_date: 'cbor:0("2026-06-18T12:59:00Z")',
        type: 'UnifiedID',
        issuer: 'Unified ID VC Issuer',
        service: 'HealthVC',
        user_id: '44da59c4-b2a0-4a3a-83c0-8b2d95b639cb',
        unified_id: 'e21d5f6b-1a97-4767-839e-0c688ca561a2',
      },
    },
  },
};
