import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, organizationName, role, position } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Create admin client with service role key
    const adminClient = createAdminClient();

    // Send Supabase invitation - user will be redirected to password setup then onboarding
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent('/set-password')}`,
      data: {
        // Store invitation metadata in user metadata
        invited_role: role,
        invited_position: position || '',
        invited_organization: organizationName || '',
        invitation_flow: true,
      }
    });

    if (inviteError) {
      console.error('Failed to send invite:', inviteError);
      return NextResponse.json(
        { error: `Failed to send invite: ${inviteError.message}` },
        { status: 500 }
      );
    }

    // Generate a link for manual sharing if needed
    const { data: linkData } = await adminClient.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent('/onboarding')}`,
        data: {
          invited_role: role,
          invited_position: position || '',
          invited_organization: organizationName || '',
        }
      },
    });

    const inviteLink = linkData?.properties?.action_link || 'Email sent to user';

    // In a production app, you would send the email here using a service like SendGrid, Resend, etc.
    // For now, we'll just log the invite details
    console.log('=== INVITATION DETAILS ===');
    console.log('Email:', email);
    console.log('Organization:', organizationName);
    console.log('Role:', role);
    console.log('Position:', position);
    console.log('User ID:', inviteData.user.id);
    console.log('Invite Link (for manual sharing):', inviteLink);
    console.log('========================');

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      inviteLink: inviteLink,
    });

  } catch (error) {
    console.error('Error in invite API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}