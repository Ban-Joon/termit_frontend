'use client';

import { Group, Box, Button, Text } from '@mantine/core';
import Link from 'next/link';

export function Header() {
  return (
    <Box py="md" px="xl" style={{ borderBottom: '1px solid #eee' }}>
      <Group justify="space-between" align="center">
        <Group gap={40}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text fw={900} size="xl" style={{ fontSize: '24px', cursor: 'pointer' }}>
              TERMIT
            </Text>
          </Link>
          <Group gap={30} visibleFrom="sm">
            <Link href="/map" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>분담금 지도</Text>
            </Link>
            <Link href="/ai" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>정비사업 AI</Text>
            </Link>
            <Link href="/reservation" style={{ textDecoration: 'none', color: 'inherit' }}>
                 <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>공사비 분석</Text>
            </Link>
            <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>회사 소개</Text>
          </Group>
        </Group>

        <Group>
          <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
             <Text size="sm" fw={500} style={{ cursor: 'pointer' }}>로그인/회원가입</Text>
          </Link>
        </Group>
      </Group>
    </Box>
  );
}
