'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Group,
  Anchor,
  Box,
} from '@mantine/core';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Container size={420} my={60}>
      <Paper withBorder shadow="sm" p={40} radius="md" style={{ borderColor: '#e9ecef' }}>
        <Title order={2} ta="left" style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          로그인/회원가입
        </Title>
        <Text c="dimmed" size="xs" ta="left" mb={30} style={{ color: '#868e96' }}>
          미래의 재건축 분담금 분석! TERMIT과 함께 시작하세요.
        </Text>

        <TextInput 
            label="이메일(ID)" 
            placeholder="이메일을 입력해 주세요." 
            required 
            styles={{ 
                label: { fontSize: '14px', marginBottom: '8px', fontWeight: 600 },
                input: { height: '48px' }
            }}
        />
        
        <PasswordInput 
            label="비밀번호" 
            placeholder="비밀번호를 입력해 주세요." 
            required 
            mt="md" 
            styles={{ 
                label: { fontSize: '14px', marginBottom: '8px', fontWeight: 600 },
                input: { height: '48px' }
            }}
        />
        
        <Button fullWidth mt="xl" size="lg" color="blue" style={{ height: '50px', fontSize: '16px' }}>
          로그인
        </Button>

        <Box mt="xl" style={{ textAlign: 'center' }}>
            <Text size="sm" c="gray.6">
                <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>회원가입</Link>
                <span style={{ margin: '0 10px', color: '#dee2e6' }}>|</span>
                <span style={{ cursor: 'pointer' }}>비밀번호 찾기</span>
            </Text>
        </Box>
      </Paper>
    </Container>
  );
}
