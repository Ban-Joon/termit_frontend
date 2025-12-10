'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Anchor,
} from '@mantine/core';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-black">
        Join TERMIT
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component="button">
          <Link href="/login">Login</Link>
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Full Name" placeholder="Your name" required />
        <TextInput label="Email" placeholder="you@mantine.dev" required mt="md" />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <PasswordInput label="Confirm Password" placeholder="Confirm your password" required mt="md" />
        
        <Button fullWidth mt="xl">
          Create Account
        </Button>
      </Paper>
    </Container>
  );
}
